from sqlalchemy import UUID
from app.extensions import db


class UserPhoto(db.Model):
    __table_args__ = {"schema": "auth"}

    id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.String(100), nullable=False)
    data_url = db.Column(db.Text, nullable=False, doc="base64 that represents an image")

    # Define one-to-one relationship with User
    user = db.relationship("User", back_populates="photo")
    # Foreign key
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("auth.users.id"), nullable=False)
