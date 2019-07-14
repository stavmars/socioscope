package gr.ekke.socioscope.domain;

import javax.validation.constraints.NotBlank;
import java.util.Map;

public class SeriesOptions {

    @NotBlank
    private String xAxis;

    private String compareBy;

    private Map<String, String> dimensionFilters;

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

    public String getMeasure() {
        return measure;
    }

    public void setMeasure(String measure) {
        this.measure = measure;
    }
}
