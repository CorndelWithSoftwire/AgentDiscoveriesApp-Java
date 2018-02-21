package org.softwire.training.db.daos;

import org.jdbi.v3.core.Handle;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.mapper.RowMapper;
import org.softwire.training.api.models.PictureApiModel;

import javax.inject.Inject;
import java.sql.Blob;
import java.util.Optional;

public class PicturesDao {
    @Inject
    Jdbi jdbi;

    public Optional<PictureApiModel> getPicture(int userId) {
        try (Handle handle = jdbi.open()) {
            RowMapper<PictureApiModel> byteMapper = (rs, ctx) -> new PictureApiModel(rs.getBytes("image"), rs.getString("file_type"), rs.getInt("user_id"));
            return handle.createQuery("SELECT * FROM profile_picture WHERE user_id = :userId")
                    .bind("userId", userId)
                    .map(byteMapper)
                    .findFirst();
        }
    }


    public int createOrUpdateUserPicture(int userId, Blob blob, String fileType) {
        try (Handle handle = jdbi.open()) {
            return handle.createUpdate("INSERT INTO profile_picture (image, file_type, user_id) "+
                    "VALUES(:image , :file_type , :user_id) "+
                    "ON DUPLICATE KEY UPDATE image = :image , file_type = :file_type")
                    .bind("user_id", userId)
                    .bind("image", blob)
                    .bind("file_type", fileType)
                    .execute();
        }
    }

    public int deleteUserPicture(int userId){
        try (Handle handle = jdbi.open()) {
            return handle.createUpdate("DELETE FROM profile_picture "+
                    "WHERE user_id = :user_id ")
                    .bind("user_id", userId)
                    .execute();
        }
    }
}
