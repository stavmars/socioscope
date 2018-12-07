package gr.ekke.socioscope.web.rest;

import com.codahale.metrics.annotation.Timed;
import gr.ekke.socioscope.domain.Codelist;
import gr.ekke.socioscope.service.CodelistService;
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
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Codelist.
 */
@RestController
@RequestMapping("/api")
public class CodelistResource {

    private final Logger log = LoggerFactory.getLogger(CodelistResource.class);

    private static final String ENTITY_NAME = "codelist";

    private final CodelistService codelistService;

    public CodelistResource(CodelistService codelistService) {
        this.codelistService = codelistService;
    }

    /**
     * POST  /codelists : Create a new codelist.
     *
     * @param codelist the codelist to create
     * @return the ResponseEntity with status 201 (Created) and with body the new codelist, or with status 400 (Bad Request) if the codelist has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/codelists")
    @Timed
    public ResponseEntity<Codelist> createCodelist(@Valid @RequestBody Codelist codelist) throws URISyntaxException {
        log.debug("REST request to save Codelist : {}", codelist);
        if (codelist.getId() != null) {
            throw new BadRequestAlertException("A new codelist cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Codelist result = codelistService.save(codelist);
        return ResponseEntity.created(new URI("/api/codelists/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /codelists : Updates an existing codelist.
     *
     * @param codelist the codelist to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated codelist,
     * or with status 400 (Bad Request) if the codelist is not valid,
     * or with status 500 (Internal Server Error) if the codelist couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/codelists")
    @Timed
    public ResponseEntity<Codelist> updateCodelist(@Valid @RequestBody Codelist codelist) throws URISyntaxException {
        log.debug("REST request to update Codelist : {}", codelist);
        if (codelist.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Codelist result = codelistService.save(codelist);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, codelist.getId().toString()))
            .body(result);
    }

    /**
     * GET  /codelists : get all the codelists.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of codelists in body
     */
    @GetMapping("/codelists")
    @Timed
    public List<Codelist> getAllCodelists() {
        log.debug("REST request to get all Codelists");
        return codelistService.findAll();
    }

    /**
     * GET  /codelists/:id : get the "id" codelist.
     *
     * @param id the id of the codelist to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the codelist, or with status 404 (Not Found)
     */
    @GetMapping("/codelists/{id}")
    @Timed
    public ResponseEntity<Codelist> getCodelist(@PathVariable String id) {
        log.debug("REST request to get Codelist : {}", id);
        Optional<Codelist> codelist = codelistService.findOne(id);
        return ResponseUtil.wrapOrNotFound(codelist);
    }

    /**
     * DELETE  /codelists/:id : delete the "id" codelist.
     *
     * @param id the id of the codelist to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/codelists/{id}")
    @Timed
    public ResponseEntity<Void> deleteCodelist(@PathVariable String id) {
        log.debug("REST request to delete Codelist : {}", id);
        codelistService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/codelists?query=:query : search for the codelist corresponding
     * to the query.
     *
     * @param query the query of the codelist search
     * @return the result of the search
     */
    @GetMapping("/_search/codelists")
    @Timed
    public List<Codelist> searchCodelists(@RequestParam String query) {
        log.debug("REST request to search Codelists for query {}", query);
        return codelistService.search(query);
    }

}
