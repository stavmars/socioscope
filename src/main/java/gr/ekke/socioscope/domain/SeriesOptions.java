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

    public String getCompareBy() {
        return compareBy;
    }

    public void setCompareBy(String compareBy) {
        this.compareBy = compareBy;
    }

    public Map<String, String> getDimensionFilters() {
        return dimensionFilters;
    }

    public void setDimensionFilters(Map<String, String> dimensionFilters) {
        this.dimensionFilters = dimensionFilters;
    }

    public List<String> getCompareCodes() {
        return compareCodes;
    }

    public void setCompareCodes(List<String> compareCodes) {
        this.compareCodes = compareCodes;
    }

    public String getMeasure() {
        return measure;
    }

    public void setMeasure(String measure) {
        this.measure = measure;
    }
}
