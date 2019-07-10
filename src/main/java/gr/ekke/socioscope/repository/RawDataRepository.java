package gr.ekke.socioscope.repository;

import com.mongodb.BasicDBObject;
import gr.ekke.socioscope.domain.DataSet;
import gr.ekke.socioscope.domain.SeriesOptions;
import gr.ekke.socioscope.service.dto.Series;
import gr.ekke.socioscope.service.dto.SeriesPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

/**
 * Spring Data MongoDB repository for managing and aggregating raw (non-aggregated data).
 */
@Repository
public class RawDataRepository {

    private final Logger log = LoggerFactory.getLogger(RawDataRepository.class);

    @Autowired
    MongoTemplate mongoTemplate;

    public List<Series> getSeries(DataSet dataSet, SeriesOptions seriesOptions) {

        String xAxis = seriesOptions.getxAxis();
        String compareBy = seriesOptions.getCompareBy();
        List<AggregationOperation> aggregationOperations = new ArrayList<>();

        String[] splitXAxis = xAxis.split("\\.");
        if (splitXAxis.length > 1) {
            aggregationOperations.add(unwind(splitXAxis[0]));
        }

        if (compareBy == null) {
            aggregationOperations.add(project("_id").and(xAxis).as("x"));
            aggregationOperations.add(group("_id", "x"));
            aggregationOperations.add(group("_id.x").count().as("y"));
            aggregationOperations.add(project("y").and("x").previousOperation());
            Aggregation agg = Aggregation.newAggregation(aggregationOperations);
            log.debug("Mongo agg query to get single series from raw dataset {}: {} ", dataSet.getId(), agg);
            Series series = new Series();
            series.setData(mongoTemplate.aggregate(agg, dataSet.getId(), SeriesPoint.class).getMappedResults());
            return Arrays.asList(series);
        }


        String[] splitCompareBy = compareBy.split("\\.");
        if (splitCompareBy.length > 1) {
            aggregationOperations.add(unwind(splitCompareBy[0]));
        }

        aggregationOperations.add(project("_id").and(xAxis).as("x").and(compareBy).as("compareBy"));
        aggregationOperations.add(group("_id", "x", "compareBy"));
        aggregationOperations.add(group("_id.x", "_id.compareBy").count().as("y"));

        aggregationOperations.add(group("compareBy").push(
            new BasicDBObject("y", "$y").append("x", "$_id.x")).as("data")
        );

        Aggregation agg = Aggregation.newAggregation(aggregationOperations);
        log.debug("Mongo agg query to get multiple series from raw dataset {}: {} ", dataSet.getId(), agg);
        return mongoTemplate.aggregate(agg, dataSet.getId(), Series.class).getMappedResults();
    }
}
