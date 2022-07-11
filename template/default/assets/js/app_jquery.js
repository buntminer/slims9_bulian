'use strict';

const filterTmp = {}
const urls = new URLSearchParams(location.search)

$(document).ready(() => {
    // 65x83
    const images = $('.fit-height');
    $.each(images, (i, v) => {
        const width = $(v).width(),
            height = (width * 83) / 65;
        // console.log(height);
        $(v).height(height)
    })

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    $('.add-to-chart').click(function (e) {
        let biblioId = $(this).attr('data-biblio')
        $.ajax({
            method: 'POST',
            url: 'index.php?p=member',
            data: {biblio: [biblioId], callback: 'json'}
        })
            .done(function (data) {
                if (data.status) {
                    toastr.success(data.message)
                } else {
                    toastr.error(data.message)
                }
                $('#count-basket').text(data.count)
            })
            .fail(function (msg) {
                console.error('ERROR!', msg)
                toastr.error(msg.responseJSON.message, '', {
                    timeOut: 2000,
                    onHidden: function () {
                        window.location.replace('index.php?p=member')
                    }
                })
            })
    })

    $('.collapse-detail')
        .on('shown.bs.collapse', e => {
            let id = e.target.getAttribute('id')
            $(`#btn-${id} i`).removeClass('fa-angle-double-down').addClass('fa-angle-double-up')
        })
        .on('hidden.bs.collapse', e => {
            let id = e.target.getAttribute('id')
            $(`#btn-${id} i`).removeClass('fa-angle-double-up').addClass('fa-angle-double-down')
        })

    $(".input-slider").ionRangeSlider({
        onFinish: function (data) {
            // collect old filter
            urls.forEach((value, key) => {
                filterTmp[key] = value
            })

            // collect new filter
            $.each($('#search-filter').serializeArray(), function (i, v) {
                filterTmp[v.name] = v.value
            })

            // redirect to new filter
            window.location.href = window.location.href.split('?')[0] + '?' + $.param(filterTmp)
        },
    });

    $('#search-filter input:not(.input-slider)').on('change', function () {
        let key = $(this).attr('name'), value = $(this).val()

        // collect old filter
        urls.forEach((value, key) => {
            filterTmp[key] = value
        })

        // collect new filter
        $.each($('#search-filter').serializeArray(), function (i, v) {
            filterTmp[v.name] = v.value
        })

        // clear unused filter
        if(!$(this).is(':checked')) delete filterTmp[key]

        // redirect to new filter
        window.location.href = window.location.href.split('?')[0] + '?' + $.param(filterTmp)
    })
});

// remove &nbsp in pagging
$('.biblioPaging .pagingList').html(function (i, h) {
    return h.replace(/&nbsp;/g, '');
});
