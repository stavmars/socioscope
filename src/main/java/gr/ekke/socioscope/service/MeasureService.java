package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.DataSet;
import gr.ekke.socioscope.domain.Measure;
import gr.ekke.socioscope.repository.DataSetRepository;
import gr.ekke.socioscope.repository.MeasureRepository;
import gr.ekke.socioscope.repository.UserRepository;
import gr.ekke.socioscope.repository.search.MeasureSearchRepository;
import gr.ekke.socioscope.security.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static gr.ekke.socioscope.security.AuthoritiesConstants.ADMIN;
import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Measure.
 */
@Service
public class MeasureService {

    private final Logger log = LoggerFactory.getLogger(MeasureService.class);

    private final MeasureRepository measureRepository;

    private final MeasureSearchRepository measureSearchRepository;

    private final UserRepository userRepository;

    public MeasureService(MeasureRepository measureRepository, MeasureSearchRepository measureSearchRepository, UserRepository userRepository) {
        this.measureRepository = measureRepository;
        this.measureSearchRepository = measureSearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * Save a measure.
     *
     * @param measure the entity to save
     * @return the persisted entity
     */
    public Measure save(Measure measure) {
        log.debug("Request to save Measure : {}", measure);
        String login = SecurityUtils.getCurrentUserLogin().get();
        measure.setCreator(userRepository.findOneByLogin(login).get());
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
            System.out.println("EIMAI O ADMIN");
            return all;
        }
        else {
            System.out.println("EIMAI ENAS USER");
            List<Measure> result = new ArrayList<>();
            for (Measure measure: all) {
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
    public void delete(String id) {
        log.debug("Request to delete Measure : {}", id);
        measureRepository.deleteById(id);
        measureSearchRepository.deleteById(id);
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
