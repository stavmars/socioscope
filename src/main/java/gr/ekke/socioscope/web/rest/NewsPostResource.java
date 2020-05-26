package gr.ekke.socioscope.web.rest;

import com.codahale.metrics.annotation.Timed;
import gr.ekke.socioscope.domain.NewsPost;
import gr.ekke.socioscope.service.NewsPostService;
import gr.ekke.socioscope.web.rest.errors.BadRequestAlertException;
import gr.ekke.socioscope.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing NewsPost.
 */
@RestController
@RequestMapping("/api")
public class NewsPostResource {

    private final Logger log = LoggerFactory.getLogger(NewsPostResource.class);

    private static final String ENTITY_NAME = "newsPost";

    private final NewsPostService newsPostService;

    public NewsPostResource(NewsPostService newsPostService) {
        this.newsPostService = newsPostService;
    }

    /**
     * POST  /news-posts : Create a new newsPost.
     *
     * @param newsPost the newsPost to create
     * @return the ResponseEntity with status 201 (Created) and with body the new newsPost, or with status 400 (Bad Request) if the newsPost has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/news-posts")
    @Timed
    public ResponseEntity<NewsPost> createNewsPost(@RequestBody NewsPost newsPost) throws URISyntaxException {
        log.debug("REST request to save NewsPost : {}", newsPost);
        if (newsPost.getId() != null) {
            throw new BadRequestAlertException("A new newsPost cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NewsPost result = newsPostService.save(newsPost);
        return ResponseEntity.created(new URI("/api/news-posts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /news-posts : Updates an existing newsPost.
     *
     * @param newsPost the newsPost to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated newsPost,
     * or with status 400 (Bad Request) if the newsPost is not valid,
     * or with status 500 (Internal Server Error) if the newsPost couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/news-posts")
    @Timed
    public ResponseEntity<NewsPost> updateNewsPost(@RequestBody NewsPost newsPost) throws URISyntaxException {
        log.debug("REST request to update NewsPost : {}", newsPost);
        if (newsPost.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        NewsPost result = newsPostService.save(newsPost);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, newsPost.getId().toString()))
            .body(result);
    }

    /**
     * GET  /news-posts : get all the newsPosts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of newsPosts in body
     */
    @GetMapping("/news-posts")
    @Timed
    public List<NewsPost> getAllNewsPosts() {
        log.debug("REST request to get all NewsPosts");
        return newsPostService.findAll();
    }

    /**
     * GET  /news-posts/:id : get the "id" newsPost.
     *
     * @param id the id of the newsPost to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the newsPost, or with status 404 (Not Found)
     */
    @GetMapping("/news-posts/{id}")
    @Timed
    public ResponseEntity<NewsPost> getNewsPost(@PathVariable String id) {
        log.debug("REST request to get NewsPost : {}", id);
        Optional<NewsPost> newsPost = newsPostService.findOne(id);
        return ResponseUtil.wrapOrNotFound(newsPost);
    }

    /**
     * DELETE  /news-posts/:id : delete the "id" newsPost.
     *
     * @param id the id of the newsPost to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/news-posts/{id}")
    @Timed
    public ResponseEntity<Void> deleteNewsPost(@PathVariable String id) {
        log.debug("REST request to delete NewsPost : {}", id);
        newsPostService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/news-posts?query=:query : search for the newsPost corresponding
     * to the query.
     *
     * @param query the query of the newsPost search
     * @return the result of the search
     */
    @GetMapping("/_search/news-posts")
    @Timed
    public List<NewsPost> searchNewsPosts(@RequestParam String query) {
        log.debug("REST request to search NewsPosts for query {}", query);
        return newsPostService.search(query);
    }

}
