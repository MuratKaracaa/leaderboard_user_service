interface UserServiceError {
  code: string;
  description: string;
}

class UserServiceErrors {
  public static readonly USERNOTFOUND: UserServiceError = {
    code: 'USERNOTFOUND',
    description: 'User with the provided user name does not exist.',
  };

  public static readonly PASSWORDNOTVALID: UserServiceError = {
    code: 'PASSWORDNOTVALID',
    description: 'The provided password is incorrect',
  };
}

export default UserServiceErrors;
