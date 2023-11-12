<?php
namespace SLiMS\Auth\Methods;

abstract class Contract
{
    /**
     * @var string $username
     */
    protected string $username = '';

    /**
     * @var string $password
     */
    protected string $password = '';

    /**
     * @var array $data
     */
    protected array $data = [];

    /**
     * Authentication for member
     */
    abstract protected function memberAuthenticate();

    /**
     * Authentication for admin
     */
    abstract protected function adminAuthenticate();

    /**
     * Generating session based on data
     *
     * @return void
     */
    public function generateSession()
    {
        foreach($this->data as $key => $value) {
            $_SESSION[$key] = $value;
        }
    }

    public function fetchRequest(array $keys)
    {
        $map = ['username','password'];
        foreach($keys as $order => $key) {
            $this->{$map[$order]} = $_POST[$key]??'';
        }
    }

    public function getData(string $key = '')
    {
        return $this->data[$key]??$this->data;
    }

    public function setData(array $data)
    {
        $this->data = $data;
    }

    public function isHas2Fa()
    {
        return isset($this->data['2fa']) && !empty($this->data['2fa']);
    }

    public function hookProcess(){}

    public function __call($method, $arguments)
    {
        if (method_exists($this, $fixMethod = $method . 'Authenticate')) {
            return $this->$fixMethod(...$arguments);
        }
    }
}