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
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.*;

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
        List<String> compareCodes = seriesOptions.getCompareCodes();

        Map<String, String> dimensionFilters = seriesOptions.getDimensionFilters();
        List<AggregationOperation> aggregationOperations = new ArrayList<>();

        Map<String, Object> filters = new HashMap<>();
        if (dimensionFilters != null) {
            filters.putAll(dimensionFilters);
        }
        if (compareBy != null && compareCodes != null && compareCodes.size() > 0) {
            filters.put(compareBy, compareCodes);
        }

        if (filters.size() > 0) {
            aggregationOperations.add(match(this.getDimensionCriteria(filters)));
        }

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

    private Criteria getDimensionCriteria(Map<String, Object> dimensionFilters) {
        Map<String, List<Map.Entry<String, Object>>> filtersByParent = dimensionFilters.entrySet().stream()
            .collect(groupingBy(entry -> {
                String dimensionId = entry.getKey();
                String[] splitDimensionId = dimensionId.split("\\.");
                return splitDimensionId.length > 1 ? splitDimensionId[0] : "";
            }));

        Criteria[] dimensionCriteria = filtersByParent.entrySet().stream().map(filterListEntry -> {
            String parent = filterListEntry.getKey();
            if (parent.isEmpty()) {
                return new Criteria().andOperator(filterListEntry.getValue().stream().map(
                    filterEntry -> {
                        if (filterEntry.getValue() instanceof List) {
                            return Criteria.where(filterEntry.getKey()).in(((List) filterEntry.getValue()).toArray());
                        } else {
                            return Criteria.where(filterEntry.getKey()).is(filterEntry.getValue());
                        }
                    }
                ).toArray(Criteria[]::new));
            }
            return Criteria.where(parent).elemMatch(new Criteria().andOperator(filterListEntry.getValue().stream().map(
                filterEntry -> {
                    String fieldName = filterEntry.getKey().split("\\.")[1];
                    if (filterEntry.getValue() instanceof List) {
                        return Criteria.where(fieldName).in(((List) filterEntry.getValue()).toArray());
                    } else {
                        return Criteria.where(fieldName).is(filterEntry.getValue());
                    }
                }
            ).toArray(Criteria[]::new)));
        }).toArray(Criteria[]::new);

        return new Criteria().andOperator(dimensionCriteria);
    }
}
