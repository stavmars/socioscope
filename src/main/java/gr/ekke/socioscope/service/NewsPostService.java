package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.NewsPost;
import gr.ekke.socioscope.repository.NewsPostRepository;
import gr.ekke.socioscope.repository.search.NewsPostSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing NewsPost.
 */
@Service
public class NewsPostService {

    private final Logger log = LoggerFactory.getLogger(NewsPostService.class);

    private final NewsPostRepository newsPostRepository;

    private final NewsPostSearchRepository newsPostSearchRepository;

    public NewsPostService(NewsPostRepository newsPostRepository, NewsPostSearchRepository newsPostSearchRepository) {
        this.newsPostRepository = newsPostRepository;
        this.newsPostSearchRepository = newsPostSearchRepository;
    }

    /**
     * Save a newsPost.
     *
     * @param newsPost the entity to save
     * @return the persisted entity
     */
    public NewsPost save(NewsPost newsPost) {
        log.debug("Request to save NewsPost : {}", newsPost);
        NewsPost result = newsPostRepository.save(newsPost);
        newsPostSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the newsPosts.
     *
     * @return the list of entities
     */
    public List<NewsPost> findAll() {
        log.debug("Request to get all NewsPosts");
        return newsPostRepository.findAll();
    }


    /**
     * Get one newsPost by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<NewsPost> findOne(String id) {
        log.debug("Request to get NewsPost : {}", id);
        return newsPostRepository.findById(id);
    }

    /**
     * Delete the newsPost by id.
     *
     * @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete NewsPost : {}", id);
        newsPostRepository.deleteById(id);
        newsPostSearchRepository.deleteById(id);
    }

    /**
     * Search for the newsPost corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    public List<NewsPost> search(String query) {
        log.debug("Request to search NewsPosts for query {}", query);
        return StreamSupport
            .stream(newsPostSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
