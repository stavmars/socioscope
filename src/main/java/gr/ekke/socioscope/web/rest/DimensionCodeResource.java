package gr.ekke.socioscope.web.rest;

import com.codahale.metrics.annotation.Timed;
import gr.ekke.socioscope.domain.DimensionCode;
import gr.ekke.socioscope.repository.DimensionCodeRepository;
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

/**
 * REST controller for managing DimensionCode.
 */
@RestController
@RequestMapping("/api")
public class DimensionCodeResource {

    private final Logger log = LoggerFactory.getLogger(DimensionCodeResource.class);

    private static final String ENTITY_NAME = "dimensionCode";

    private final DimensionCodeRepository dimensionCodeRepository;

    public DimensionCodeResource(DimensionCodeRepository dimensionCodeRepository) {
        this.dimensionCodeRepository = dimensionCodeRepository;
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
        if (dimensionCode.getId() != null && dimensionCodeRepository.existsById(dimensionCode.getId())) {
            throw new BadRequestAlertException("Dimension code already exists", "dimension_code", "dimensioncodeexists");
        }
        DimensionCode result = dimensionCodeRepository.save(dimensionCode);
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
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
}
