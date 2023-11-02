# class AuthService:
#     @staticmethod
#     def login(username, password):
#         user = User.query.filter_by(username=username, password=password).first()
#         return user

#     @staticmethod
#     def signup(username, password):
#         existing_user = User.query.filter_by(username=username).first()
#         if existing_user:
#             return None  # Username already exists

#         new_user = User(username=username, password=password)
#         db.session.add(new_user)
#         db.session.commit()
#         return new_user  # Return the newly created user