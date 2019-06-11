package gr.ekke.socioscope.service.dto;

import gr.ekke.socioscope.domain.DimensionValue;

import javax.validation.constraints.NotBlank;
import java.util.List;

public class SeriesOptions {

    @NotBlank
    private String xAxis;

    private String compareBy;

    private List<DimensionValue> dimensionValues;

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

    public List<DimensionValue> getDimensionValues() {
        return dimensionValues;
    }

    public void setDimensionValues(List<DimensionValue> dimensionValues) {
        this.dimensionValues = dimensionValues;
    }

    public String getMeasure() {
        return measure;
    }

    public void setMeasure(String measure) {
        this.measure = measure;
    }
}
