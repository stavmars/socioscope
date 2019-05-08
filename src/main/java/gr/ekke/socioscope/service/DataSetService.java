package gr.ekke.socioscope.service;

import gr.ekke.socioscope.domain.DataSet;
import gr.ekke.socioscope.domain.Dimension;
import gr.ekke.socioscope.domain.Measure;
import gr.ekke.socioscope.repository.DataSetRepository;
import gr.ekke.socioscope.repository.DimensionRepository;
import gr.ekke.socioscope.repository.MeasureRepository;
import gr.ekke.socioscope.repository.UserRepository;
import gr.ekke.socioscope.repository.search.DataSetSearchRepository;
import gr.ekke.socioscope.security.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static gr.ekke.socioscope.security.AuthoritiesConstants.ADMIN;
import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing DataSet.
 */
@Service
public class DataSetService {

    private final Logger log = LoggerFactory.getLogger(DataSetService.class);

    private final DataSetRepository dataSetRepository;

    private final DataSetSearchRepository dataSetSearchRepository;

    private final UserRepository userRepository;

    private final DimensionRepository dimensionRepository;

    private final MeasureRepository measureRepository;

    public DataSetService(DataSetRepository dataSetRepository, DataSetSearchRepository dataSetSearchRepository, UserRepository userRepository, DimensionRepository dimensionRepository, MeasureRepository measureRepository) {
        this.dataSetRepository = dataSetRepository;
        this.dataSetSearchRepository = dataSetSearchRepository;
        this.userRepository = userRepository;
        this.dimensionRepository = dimensionRepository;
        this.measureRepository = measureRepository;
    }

    /**
     * Save a dataSet.
     *
     * @param dataSet the entity to save
     * @return the persisted entity
     */
    public DataSet save(DataSet dataSet) {
        log.debug("Request to save DataSet : {}", dataSet);
        String login = SecurityUtils.getCurrentUserLogin().get();
        dataSet.setCreator(userRepository.findOneByLogin(login).get());
        DataSet result = dataSetRepository.save(dataSet);
        dataSetSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the dataSets.
     *
     * @return the list of entities
     */
    public List<DataSet> findAll() {
        log.debug("Request to get all DataSets");
        List<DataSet> all = dataSetRepository.findAll();
        if (SecurityUtils.isCurrentUserInRole(ADMIN)) {
            System.out.println("EIMAI O ADMIN");
            return all;
        }
        else {
            System.out.println("EIMAI ENAS USER");
            List<DataSet> result = new ArrayList<>();
            for (DataSet dataset: all) {
                if (!dataset.getCreator().getLogin().equals("admin")) {
                    result.add(dataset);
                }
            }
            return result;
        }
    }


    /**
     * Get one dataSet by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    public Optional<DataSet> findOne(String id) {
        log.debug("Request to get DataSet : {}", id);
        return dataSetRepository.findById(id);
    }

    /**
     * Delete the dataSet by id.
     *
     * @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete DataSet : {}", id);
        dataSetRepository.deleteById(id);
        dataSetSearchRepository.deleteById(id);
    }

    /**
     * Search for the dataSet corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    public List<DataSet> search(String query) {
        log.debug("Request to search DataSets for query {}", query);
        return StreamSupport
            .stream(dataSetSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    /**
     * Remove one dimension dimensionId from dataSet with dataSetId
     *
     * @param dimensionId the id of the dimension entity
     * @param dataSetId the id of the dataSet entity
     * @return the entity
     */
    public DataSet removeDimension(String dataSetId, String dimensionId) {
        log.debug("Request to remove Dimension : {} from DataSet : {}", dimensionId, dataSetId);
        Optional<DataSet> dataSet = dataSetRepository.findById(dataSetId);
        Optional<Dimension> dimension = dimensionRepository.findById(dimensionId);

        if (!dataSet.isPresent() || !dimension.isPresent()) {
            return null;
        }
        DataSet result = dataSetRepository.save(dataSet.get().removeDimension(dimension.get()));
        return result;
    }

    /**
     * Remove one measure measureId from dataSet with dataSetId
     *
     * @param measureId the id of the measure entity
     * @param dataSetId the id of the dataSet entity
     * @return the entity
     */
    public DataSet removeMeasure(String dataSetId, String measureId) {
        log.debug("Request to remove Measure : {} from DataSet : {}", measureId, dataSetId);
        Optional<DataSet> dataSet = dataSetRepository.findById(dataSetId);
        Optional<Measure> measure = measureRepository.findById(measureId);

        if (!dataSet.isPresent() || !measure.isPresent()) {
            return null;
        }
        DataSet result = dataSetRepository.save(dataSet.get().removeMeasure(measure.get()));
        return result;
    }
}
