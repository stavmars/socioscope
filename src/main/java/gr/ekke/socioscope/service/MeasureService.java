package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.Measure;
import gr.ekke.socioscope.repository.DataSetRepository;
import gr.ekke.socioscope.repository.MeasureRepository;
import gr.ekke.socioscope.repository.search.MeasureSearchRepository;
import gr.ekke.socioscope.security.SecurityUtils;
import gr.ekke.socioscope.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static gr.ekke.socioscope.security.AuthoritiesConstants.ADMIN;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing Measure.
 */
@Service
public class MeasureService {

    private final Logger log = LoggerFactory.getLogger(MeasureService.class);

    private final MeasureRepository measureRepository;

    private final MeasureSearchRepository measureSearchRepository;

    private final DataSetRepository dataSetRepository;

    private final UserService userService;

    public MeasureService(MeasureRepository measureRepository, MeasureSearchRepository measureSearchRepository, DataSetRepository dataSetRepository, UserService userService) {
        this.measureRepository = measureRepository;
        this.measureSearchRepository = measureSearchRepository;
        this.dataSetRepository = dataSetRepository;
        this.userService = userService;
    }

    /**
     * Create a measure.
     *
     * @param measure the entity to create
     * @return the persisted entity
     */
    public Measure create(Measure measure) {
        log.debug("Request to create Measure : {}", measure);
        if (measure.getId() != null && measureRepository.existsById(measure.getId())) {
            throw new BadRequestAlertException("Measure already exists", "measure", "measureexists");
        }
        measure.setCreator(userService.getUserWithAuthorities().orElse(null));
        Measure result = measureRepository.save(measure);
        measureSearchRepository.save(result);
        return result;
    }

    /**
     * Update a measure.
     *
     * @param measure the entity to update
     * @return the persisted entity
     */
    public Measure update(Measure measure) {
        log.debug("Request to update Measure : {}", measure);
        Measure result = measureRepository.save(measure);
        measureSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the measures.
     *
     * @return the list of entities
     */
    public List<Measure> findAll() {
        log.debug("Request to get all Measures");
        List<Measure> all = measureRepository.findAll();
        if (SecurityUtils.isCurrentUserInRole(ADMIN)) {
            return all;
        } else {
            List<Measure> result = new ArrayList<>();
            for (Measure measure : all) {
                if (!measure.getCreator().getLogin().equals("admin")) {
                    result.add(measure);
                }
            }
            return result;
        }
    }


    /**
     * Get one measure by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<Measure> findOne(String id) {
        log.debug("Request to get Measure : {}", id);
        return measureRepository.findById(id);
    }

    /**
     * Delete the measure by id.
     *
     * @param id the id of the entity
     */
    public boolean delete(String id) {
        log.debug("Request to delete Measure : {}", id);
        Optional<Measure> measure = measureRepository.findById(id);
        if (measure.isPresent() && dataSetRepository.findAllByMeasuresContains(measure.get()).isEmpty()) {
            measureRepository.deleteById(id);
            measureSearchRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Search for the measure corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    public List<Measure> search(String query) {
        log.debug("Request to search Measures for query {}", query);
        return StreamSupport
            .stream(measureSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
