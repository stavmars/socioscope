package gr.ekke.socioscope.repository;

import gr.ekke.socioscope.domain.BlogPost;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the BlogPost entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlogPostRepository extends MongoRepository<BlogPost, String> {

}
