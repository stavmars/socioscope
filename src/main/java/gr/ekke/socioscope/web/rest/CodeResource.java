package gr.ekke.socioscope.web.rest;

import com.codahale.metrics.annotation.Timed;
import gr.ekke.socioscope.domain.Code;
import gr.ekke.socioscope.repository.CodeRepository;
import gr.ekke.socioscope.repository.search.CodeSearchRepository;
import gr.ekke.socioscope.web.rest.errors.BadRequestAlertException;
import gr.ekke.socioscope.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Code.
 */
@RestController
@RequestMapping("/api")
public class CodeResource {

    private final Logger log = LoggerFactory.getLogger(CodeResource.class);

    private static final String ENTITY_NAME = "code";

    private final CodeRepository codeRepository;

    private final CodeSearchRepository codeSearchRepository;

    public CodeResource(CodeRepository codeRepository, CodeSearchRepository codeSearchRepository) {
        this.codeRepository = codeRepository;
        this.codeSearchRepository = codeSearchRepository;
    }

    /**
     * POST  /codes : Create a new code.
     *
     * @param code the code to create
     * @return the ResponseEntity with status 201 (Created) and with body the new code, or with status 400 (Bad Request) if the code has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/codes")
    @Timed
    public ResponseEntity<Code> createCode(@Valid @RequestBody Code code) throws URISyntaxException {
        log.debug("REST request to save Code : {}", code);
        if (code.getId() != null) {
            throw new BadRequestAlertException("A new code cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Code result = codeRepository.save(code);
        codeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/codes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /codes : Updates an existing code.
     *
     * @param code the code to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated code,
     * or with status 400 (Bad Request) if the code is not valid,
     * or with status 500 (Internal Server Error) if the code couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/codes")
    @Timed
    public ResponseEntity<Code> updateCode(@Valid @RequestBody Code code) throws URISyntaxException {
        log.debug("REST request to update Code : {}", code);
        if (code.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Code result = codeRepository.save(code);
        codeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, code.getId().toString()))
            .body(result);
    }

    /**
     * GET  /codes : get all the codes.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of codes in body
     */
    @GetMapping("/codes")
    @Timed
    public List<Code> getAllCodes() {
        log.debug("REST request to get all Codes");
        return codeRepository.findAll();
    }

    /**
     * GET  /codes/:id : get the "id" code.
     *
     * @param id the id of the code to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the code, or with status 404 (Not Found)
     */
    @GetMapping("/codes/{id}")
    @Timed
    public ResponseEntity<Code> getCode(@PathVariable String id) {
        log.debug("REST request to get Code : {}", id);
        Optional<Code> code = codeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(code);
    }

    /**
     * DELETE  /codes/:id : delete the "id" code.
     *
     * @param id the id of the code to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/codes/{id}")
    @Timed
    public ResponseEntity<Void> deleteCode(@PathVariable String id) {
        log.debug("REST request to delete Code : {}", id);

        codeRepository.deleteById(id);
        codeSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/codes?query=:query : search for the code corresponding
     * to the query.
     *
     * @param query the query of the code search
     * @return the result of the search
     */
    @GetMapping("/_search/codes")
    @Timed
    public List<Code> searchCodes(@RequestParam String query) {
        log.debug("REST request to search Codes for query {}", query);
        return StreamSupport
            .stream(codeSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
