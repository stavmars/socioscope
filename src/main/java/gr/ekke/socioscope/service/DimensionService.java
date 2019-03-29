package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.DataSet;
import gr.ekke.socioscope.domain.Dimension;
import gr.ekke.socioscope.repository.DataSetRepository;
import gr.ekke.socioscope.repository.DimensionRepository;
import gr.ekke.socioscope.repository.UserRepository;
import gr.ekke.socioscope.repository.search.DimensionSearchRepository;
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
 * Service Implementation for managing Dimension.
 */
@Service
public class DimensionService {

    private final Logger log = LoggerFactory.getLogger(DimensionService.class);

    private final DimensionRepository dimensionRepository;

    private final DimensionSearchRepository dimensionSearchRepository;

    private final UserRepository userRepository;

    private final DataSetRepository dataSetRepository;

    public DimensionService(DimensionRepository dimensionRepository, DimensionSearchRepository dimensionSearchRepository, UserRepository userRepository, DataSetRepository dataSetRepository) {
        this.dimensionRepository = dimensionRepository;
        this.dimensionSearchRepository = dimensionSearchRepository;
        this.userRepository = userRepository;
        this.dataSetRepository = dataSetRepository;
    }

    /**
     * Save a dimension.
     *
     * @param dimension the entity to save
     * @return the persisted entity
     */
    public Dimension save(Dimension dimension) {
        log.debug("Request to save Dimension : {}", dimension);
        String login = SecurityUtils.getCurrentUserLogin().get();
        dimension.setCreator(userRepository.findOneByLogin(login).get());
        Dimension result = dimensionRepository.save(dimension);
        DataSet dataSet = dataSetRepository.findById(result.getDataset().getId()).get();
        dataSet.addDimensions(result);
        dataSetRepository.save(dataSet);
        dimensionSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the dimensions.
     *
     * @return the list of entities
     */
    public List<Dimension> findAll() {
        log.debug("Request to get all Dimensions");
        List<Dimension> all = dimensionRepository.findAll();
        if (SecurityUtils.isCurrentUserInRole(ADMIN)) {
            System.out.println("EIMAI O ADMIN");
            return all;
        }
        else {
            System.out.println("EIMAI ENAS USERS");
            List<Dimension> result = new ArrayList<>();
            for (Dimension dimension: all) {
                if (!dimension.getCreator().getLogin().equals("admin")) {
                    result.add(dimension);
                }
            }
            return result;
        }
    }


    /**
     * Get one dimension by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<Dimension> findOne(String id) {
        log.debug("Request to get Dimension : {}", id);
        return dimensionRepository.findById(id);
    }

    /**
     * Delete the dimension by id.
     *
     * @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete Dimension : {}", id);
        Dimension dimension = dimensionRepository.findById(id).get();
        DataSet dataSet = dataSetRepository.findById(dimension.getDataset().getId()).get();
        dataSet.removeDimensions(dimension);
        dataSetRepository.save(dataSet);
        dimensionRepository.deleteById(id);
        dimensionSearchRepository.deleteById(id);
    }

    /**
     * Search for the dimension corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    public List<Dimension> search(String query) {
        log.debug("Request to search Dimensions for query {}", query);
        return StreamSupport
            .stream(dimensionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
