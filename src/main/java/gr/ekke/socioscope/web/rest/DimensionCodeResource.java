package gr.ekke.socioscope.web.rest;

import com.codahale.metrics.annotation.Timed;
import gr.ekke.socioscope.domain.DimensionCode;
import gr.ekke.socioscope.repository.DimensionCodeRepository;
import gr.ekke.socioscope.repository.search.DimensionCodeSearchRepository;
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
 * REST controller for managing DimensionCode.
 */
@RestController
@RequestMapping("/api")
public class DimensionCodeResource {

    private final Logger log = LoggerFactory.getLogger(DimensionCodeResource.class);

    private static final String ENTITY_NAME = "dimensionCode";

    private final DimensionCodeRepository dimensionCodeRepository;

    private final DimensionCodeSearchRepository dimensionCodeSearchRepository;

    public DimensionCodeResource(DimensionCodeRepository dimensionCodeRepository, DimensionCodeSearchRepository dimensionCodeSearchRepository) {
        this.dimensionCodeRepository = dimensionCodeRepository;
        this.dimensionCodeSearchRepository = dimensionCodeSearchRepository;
    }

    /**
     * POST  /dimension-codes : Create a new dimensionCode.
     *
     * @param dimensionCode the dimensionCode to create
     * @return the ResponseEntity with status 201 (Created) and with body the new dimensionCode, or with status 400 (Bad Request) if the dimensionCode has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/dimension-codes")
    @Timed
    public ResponseEntity<DimensionCode> createDimensionCode(@Valid @RequestBody DimensionCode dimensionCode) throws URISyntaxException {
        log.debug("REST request to save DimensionCode : {}", dimensionCode);
        if (dimensionCode.getId() != null) {
            throw new BadRequestAlertException("A new dimensionCode cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DimensionCode result = dimensionCodeRepository.save(dimensionCode);
        dimensionCodeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/dimension-codes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /dimension-codes : Updates an existing dimensionCode.
     *
     * @param dimensionCode the dimensionCode to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated dimensionCode,
     * or with status 400 (Bad Request) if the dimensionCode is not valid,
     * or with status 500 (Internal Server Error) if the dimensionCode couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/dimension-codes")
    @Timed
    public ResponseEntity<DimensionCode> updateDimensionCode(@Valid @RequestBody DimensionCode dimensionCode) throws URISyntaxException {
        log.debug("REST request to update DimensionCode : {}", dimensionCode);
        if (dimensionCode.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DimensionCode result = dimensionCodeRepository.save(dimensionCode);
        dimensionCodeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, dimensionCode.getId().toString()))
            .body(result);
    }

    /**
     * GET  /dimension-codes : get all the dimensionCodes.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of dimensionCodes in body
     */
    @GetMapping("/dimension-codes")
    @Timed
    public List<DimensionCode> getAllDimensionCodes() {
        log.debug("REST request to get all DimensionCodes");
        return dimensionCodeRepository.findAll();
    }

    /**
     * GET  /dimension-codes/:id : get the "id" dimensionCode.
     *
     * @param id the id of the dimensionCode to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the dimensionCode, or with status 404 (Not Found)
     */
    @GetMapping("/dimension-codes/{id}")
    @Timed
    public ResponseEntity<DimensionCode> getDimensionCode(@PathVariable String id) {
        log.debug("REST request to get DimensionCode : {}", id);
        Optional<DimensionCode> dimensionCode = dimensionCodeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dimensionCode);
    }

    /**
     * DELETE  /dimension-codes/:id : delete the "id" dimensionCode.
     *
     * @param id the id of the dimensionCode to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/dimension-codes/{id}")
    @Timed
    public ResponseEntity<Void> deleteDimensionCode(@PathVariable String id) {
        log.debug("REST request to delete DimensionCode : {}", id);

        dimensionCodeRepository.deleteById(id);
        dimensionCodeSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/dimension-codes?query=:query : search for the dimensionCode corresponding
     * to the query.
     *
     * @param query the query of the dimensionCode search
     * @return the result of the search
     */
    @GetMapping("/_search/dimension-codes")
    @Timed
    public List<DimensionCode> searchDimensionCodes(@RequestParam String query) {
        log.debug("REST request to search DimensionCodes for query {}", query);
        return StreamSupport
            .stream(dimensionCodeSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
