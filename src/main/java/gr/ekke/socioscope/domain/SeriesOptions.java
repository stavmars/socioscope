package gr.ekke.socioscope.domain;

import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

public class SeriesOptions {

    @NotBlank
    private String xAxis;

    private String compareBy;

    private Map<String, String> dimensionFilters;

    private List<String> compareCodes;

    private String measure;

    public String getxAxis() {
        return xAxis;
    }

    public void setxAxis(String xAxis) {
        this.xAxis = xAxis;
    }

    public SeriesOptions xAxis(String xAxis) {
        this.xAxis = xAxis;
        return this;
    }

    public String getCompareBy() {
        return compareBy;
    }

    public void setCompareBy(String compareBy) {
        this.compareBy = compareBy;
    }

    public SeriesOptions compareBy(String compareBy) {
        this.compareBy = compareBy;
        return this;
    }

    public Map<String, String> getDimensionFilters() {
        return dimensionFilters;
    }

    public void setDimensionFilters(Map<String, String> dimensionFilters) {
        this.dimensionFilters = dimensionFilters;
    }

    public SeriesOptions dimensionFilters(Map<String, String> dimensionFilters) {
        this.dimensionFilters = dimensionFilters;
        return this;
    }

    public List<String> getCompareCodes() {
        return compareCodes;
    }

    public void setCompareCodes(List<String> compareCodes) {
        this.compareCodes = compareCodes;
    }

    public SeriesOptions compareCodes(List<String> compareCodes) {
        this.compareCodes = compareCodes;
        return this;
    }

    public String getMeasure() {
        return measure;
    }

    public void setMeasure(String measure) {
        this.measure = measure;
    }

    public SeriesOptions measure(String measure) {
        this.measure = measure;
        return this;
    }
}
