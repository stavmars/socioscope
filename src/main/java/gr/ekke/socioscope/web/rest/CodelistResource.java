package gr.ekke.socioscope.web.rest;

import com.codahale.metrics.annotation.Timed;
import gr.ekke.socioscope.domain.Codelist;
import gr.ekke.socioscope.service.CodelistService;
import gr.ekke.socioscope.web.rest.errors.BadRequestAlertException;
import gr.ekke.socioscope.web.rest.util.HeaderUtil;
import gr.ekke.socioscope.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
        Codelist result = codelistService.createCodelist(codelist);
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
        Optional<Codelist> updatedCodeList = codelistService.updateCodelist(codelist);
        return ResponseUtil.wrapOrNotFound(updatedCodeList, HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, codelist.getId()));
    }

    /**
     * GET  /codelists : get all the codelists.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of codelists in body
     */
    @GetMapping("/codelists")
    @Timed
    public ResponseEntity<List<Codelist>> getAllCodelists(Pageable pageable) {
        log.debug("REST request to get a page of Codelists");
        Page<Codelist> page = codelistService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/codelists");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
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
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/codelists")
    @Timed
    public ResponseEntity<List<Codelist>> searchCodelists(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Codelists for query {}", query);
        Page<Codelist> page = codelistService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/codelists");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
