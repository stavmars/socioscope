package gr.ekke.socioscope.repository;

import com.mongodb.BasicDBObject;
import gr.ekke.socioscope.domain.DataSet;
import gr.ekke.socioscope.domain.Dimension;
import gr.ekke.socioscope.domain.DimensionType;
import gr.ekke.socioscope.domain.SeriesOptions;
import gr.ekke.socioscope.service.dto.Series;
import gr.ekke.socioscope.service.dto.SeriesPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

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
        Dimension xAxisDimension = dataSet.getDimensions().stream().filter(dim -> dim.getId().equals(seriesOptions.getxAxis()))
            .findFirst().get();
        String compareBy = seriesOptions.getCompareBy();
        List<String> compareCodes = seriesOptions.getCompareCodes();

        Map<String, String> dimensionFilters = seriesOptions.getDimensionFilters();

        List<String> fields = new ArrayList<>(dimensionFilters.keySet());
        fields.add(xAxis);
        fields.add(compareBy);

        List<AggregationOperation> aggregationOperations = addUnwindSteps(new ArrayList<>(), fields);

        //add extra unwind steps for xAxis and compareBy field in case they're arrays (e.g. election.changes in deputies)
        //if the field is not an array these steps have no effect
        //but they remove documents with null or missing values in every case
        aggregationOperations.add(unwind(xAxis));
        if (compareBy != null) {
            aggregationOperations.add(unwind(compareBy));
        }

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

        ProjectionOperation xProjectionOperation = xAxisDimension.getType().equals(DimensionType.TIME) ? project("_id").and(xAxis).dateAsFormattedString("%Y-%m").as("x") :
            project("_id").and(xAxis).as("x");

        if (compareBy == null) {
            aggregationOperations.add(xProjectionOperation);
            aggregationOperations.add(group("_id", "x"));
            aggregationOperations.add(group("_id.x").count().as("y"));
            aggregationOperations.add(project("y").and("x").previousOperation());
            Aggregation agg = Aggregation.newAggregation(aggregationOperations);
            log.debug("Mongo agg query to get single series from raw dataset {}: {} ", dataSet.getId(), agg);
            Series series = new Series();
            series.setData(mongoTemplate.aggregate(agg, dataSet.getId(), SeriesPoint.class).getMappedResults());
            return Arrays.asList(series);
        }

        aggregationOperations.add(xProjectionOperation.and(compareBy).as("compareBy"));
        aggregationOperations.add(group("_id", "x", "compareBy"));
        aggregationOperations.add(group("_id.x", "_id.compareBy").count().as("y"));

        aggregationOperations.add(group("compareBy").push(
            new BasicDBObject("y", "$y").append("x", "$_id.x")).as("data")
        );

        Aggregation agg = Aggregation.newAggregation(aggregationOperations);
        log.debug("Mongo agg query to get multiple series from raw dataset {}: {} ", dataSet.getId(), agg);

        List<Series> seriesList = mongoTemplate.aggregate(agg, dataSet.getId(), Series.class).getMappedResults();

        return fillZeroValues(seriesList);
    }

    private List<Series> fillZeroValues(List<Series> seriesList) {
        // find distinct series point x values across all series
        List<String> allKeys = seriesList.stream().flatMap(series -> series.getData().stream().map(SeriesPoint::getX)).distinct().collect(Collectors.toList());

        seriesList.stream()
            .forEach(series -> {
                Set keys = series.getData().stream().map(SeriesPoint::getX).collect(Collectors.toSet());
                List zeroPoints = allKeys.stream().filter(key -> !keys.contains(key)).map(key -> new SeriesPoint(key, 0d)).collect(Collectors.toList());
                series.getData().addAll(zeroPoints);
            });
        return seriesList;
    }


    private Criteria getDimensionCriteria(Map<String, Object> dimensionFilters) {
        /*Map<String, List<Map.Entry<String, Object>>> filtersByParent = dimensionFilters.entrySet().stream()
            .collect(groupingBy(entry -> {
                String dimensionId = entry.getKey();
                String[] splitDimensionId = dimensionId.split("\\.");
                return splitDimensionId.length > 1 ? splitDimensionId[0] : "";
            }));
*/
        Criteria[] dimensionCriteria = dimensionFilters.entrySet().stream().map(filterEntry -> {
            if (filterEntry.getValue() instanceof List) {
                return Criteria.where(filterEntry.getKey()).in(((List) filterEntry.getValue()).toArray());
            } else {
                return Criteria.where(filterEntry.getKey()).is(filterEntry.getValue());
            }
        }).toArray(Criteria[]::new);

        /*Criteria[] dimensionCriteria = filtersByParent.entrySet().stream().map(filterListEntry -> {
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
        }).toArray(Criteria[]::new);*/

        return new Criteria().andOperator(dimensionCriteria);
    }

    private List<AggregationOperation> addUnwindSteps(List<AggregationOperation> aggregationOperations, List<String> fields) {
        Set<String> unwindFields = new HashSet<>();
        for (String field : fields) {
            if (field == null)
                continue;
            String[] splitField = field.split("\\.");
            if (splitField.length > 1) {
                unwindFields.add(splitField[0]);
            }
        }
        for (String field : unwindFields) {
            aggregationOperations.add(unwind(field));
        }
        return aggregationOperations;

    }
}
