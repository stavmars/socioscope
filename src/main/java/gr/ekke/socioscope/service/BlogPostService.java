package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.BlogPost;
import gr.ekke.socioscope.repository.BlogPostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing BlogPost.
 */
@Service
public class BlogPostService {

    private final Logger log = LoggerFactory.getLogger(BlogPostService.class);

    private final BlogPostRepository blogPostRepository;

    public BlogPostService(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    /**
     * Save a blogPost.
     *
     * @param blogPost the entity to save
     * @return the persisted entity
     */
    public BlogPost save(BlogPost blogPost) {
        log.debug("Request to save BlogPost : {}", blogPost);
        return blogPostRepository.save(blogPost);
    }

    /**
     * Get all the blogPosts.
     *
     * @return the list of entities
     */
    public List<BlogPost> findAll() {
        log.debug("Request to get all BlogPosts");
        return blogPostRepository.findAll();
    }


    /**
     * Get one blogPost by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<BlogPost> findOne(String id) {
        log.debug("Request to get BlogPost : {}", id);
        return blogPostRepository.findById(id);
    }

    /**
     * Delete the blogPost by id.
     *
     * @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete BlogPost : {}", id);
        blogPostRepository.deleteById(id);
    }
}
