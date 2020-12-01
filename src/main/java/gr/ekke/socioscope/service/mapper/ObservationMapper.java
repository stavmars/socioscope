package gr.ekke.socioscope.service.mapper;

import gr.ekke.socioscope.domain.Observation;
import gr.ekke.socioscope.service.dto.Series;
import gr.ekke.socioscope.domain.SeriesOptions;
import gr.ekke.socioscope.service.dto.SeriesPoint;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mapper for the entity Observation and its representation as a SeriesPoint.
 */
@Service
public class ObservationMapper {

    public SeriesPoint observationToSeriesPoint(Observation observation, SeriesOptions seriesOptions) {
        return observation.getDimensions().stream().filter(dimensionValue -> dimensionValue.getId().equals(seriesOptions.getxAxis()))
            .findFirst().map(dimensionValue -> new SeriesPoint(dimensionValue.getValue(), observation.getMeasures().get(seriesOptions.getMeasure()))).get();
    }

    public List<SeriesPoint> observationsToSeriesPoints(List<Observation> observations, SeriesOptions seriesOptions) {
        return observations.stream().map(obs -> this.observationToSeriesPoint(obs, seriesOptions)).collect(Collectors.toList());
    }


    public List<Series> observationsToMultipleSeries(List<Observation> observations, SeriesOptions seriesOptions) {
        String compareBy = seriesOptions.getCompareBy();
        List<Series> seriesList;
        if (compareBy != null) {
            Map<String, List<Observation>> byCompare
                = observations.stream().collect(Collectors.groupingBy(obs -> obs.getDimensionValue(compareBy)));
            seriesList = byCompare.entrySet().stream().map(entry -> {
                Series series = new Series();
                series.setId(entry.getKey());
                series.setData(this.observationsToSeriesPoints(entry.getValue(), seriesOptions));
                return series;
            }).collect(Collectors.toList());
            seriesList = fillMissingValues(seriesList);
        } else {
            Series series = new Series();
            series.setData(this.observationsToSeriesPoints(observations, seriesOptions));
            seriesList = new ArrayList(1);
            seriesList.add(series);
        }
        return seriesList;
    }

    private List<Series> fillMissingValues(List<Series> seriesList) {
        // find distinct series point x values across all series
        List<String> allKeys = seriesList.stream().flatMap(series -> series.getData().stream().map(SeriesPoint::getX)).distinct().collect(Collectors.toList());

        seriesList.stream()
            .forEach(series -> {
                Set keys = series.getData().stream().map(SeriesPoint::getX).collect(Collectors.toSet());
                List missingPoints = allKeys.stream().filter(key -> !keys.contains(key)).map(key -> new SeriesPoint(key, null)).collect(Collectors.toList());
                series.getData().addAll(missingPoints);
            });
        return seriesList;
    }

}
