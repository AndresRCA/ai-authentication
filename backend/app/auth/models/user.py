from sqlalchemy import UUID, String, text
from app.extensions import db


class User(db.Model):
    __tablename__ = "users"
    __table_args__ = {"schema": "auth"}

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        unique=True,
        nullable=False,
        server_default=text("gen_random_uuid()"),
    )
    username = db.Column(String(80), unique=True, nullable=False)
    password = db.Column(String(80), nullable=False)

    # Define one-to-one relationship with UserImages
    user_photo = db.relationship(
        "UserPhoto",
        uselist=False, # uselist=False => one-to-one relationship
        back_populates="user", # back_populates => establish 
    )

    def __repr__(self):
        return f"<User {self.username}>"
