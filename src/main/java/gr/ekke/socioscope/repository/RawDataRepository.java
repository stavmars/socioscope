package gr.ekke.socioscope.repository;

import com.mongodb.BasicDBObject;
import gr.ekke.socioscope.domain.DataSet;
import gr.ekke.socioscope.domain.DimensionValue;
import gr.ekke.socioscope.domain.SeriesOptions;
import gr.ekke.socioscope.service.dto.Series;
import gr.ekke.socioscope.service.dto.SeriesPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.groupingBy;
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
        Map<String, String> dimensionFilters = seriesOptions.getDimensionFilters();
        List<AggregationOperation> aggregationOperations = new ArrayList<>();


        if (dimensionFilters != null) {
            aggregationOperations.add(match(this.getDimensionCriteria(dimensionFilters)));
        }
        ;

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

    private Criteria getDimensionCriteria(Map<String, String> dimensionFilters) {
        Map<String, List<DimensionValue>> byParent = dimensionFilters.entrySet().stream()
            .map(entry -> new DimensionValue(entry.getKey(), entry.getValue()))
            .collect(groupingBy(dimensionValue -> {
                String dimensionId = dimensionValue.getId();
                String[] splitDimensionId = dimensionId.split("\\.");
                return splitDimensionId.length > 1 ? splitDimensionId[0] : "";
            }));

        Criteria[] dimensionCriteria = byParent.entrySet().stream().map(entry -> {
            String parent = entry.getKey();
            if (parent.isEmpty()) {
                return new Criteria().andOperator(entry.getValue().stream().map(
                    dimensionValue -> Criteria.where(dimensionValue.getId()).is(dimensionValue.getValue())
                ).toArray(Criteria[]::new));
            }
            return Criteria.where(parent).elemMatch(new Criteria().andOperator(entry.getValue().stream().map(
                dimensionValue -> Criteria.where(dimensionValue.getId().split("\\.")[1]).is(dimensionValue.getValue())
            ).toArray(Criteria[]::new)));
        }).toArray(Criteria[]::new);

        return new Criteria().andOperator(dimensionCriteria);
    }
}
