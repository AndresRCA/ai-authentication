from werkzeug.security import generate_password_hash, check_password_hash

class AuthService:
    """
    Service used to run operations in the `auth` module
    """

    @staticmethod
    def hash_password(password):
        hashed_password = generate_password_hash(password)
        return hashed_password

    @staticmethod
    def compare_passwords(hashed_password, raw_password):
        return check_password_hash(hashed_password, raw_password)
