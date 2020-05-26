package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.NewsPost;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the NewsPost entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NewsPostRepository extends MongoRepository<NewsPost, String> {

}
