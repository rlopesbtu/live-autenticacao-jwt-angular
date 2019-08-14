<?php
namespace Preditor\Http\Controllers\Api;

use Preditor\Http\Controllers\Controller;
use Preditor\Http\Requests\AddCpfRequest;
use Preditor\Http\Requests\UserSettingRequest;
use Preditor\Repositories\UserRepository;

class UsersController extends Controller
{
    /**
     * @var UserRepository
     */
    private $repository;

    public function __construct(UserRepository $repository)
    {

        $this->repository = $repository;
    }

    public function updateSettings(UserSettingRequest $request)
    {
        $data = $request->only('password');
        $this->repository->update($data, $request->user('api')->id);

        return $request->user('api');
    }

    public function addCpf(AddCpfRequest $request)
    {
        $user = $this->repository->update([
            'cpf' => $request->input('cpf')
        ],$request->user('api')->id);
        return $user;
    }
}
