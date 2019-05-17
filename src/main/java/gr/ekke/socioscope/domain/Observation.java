package gr.ekke.socioscope.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.*;

/**
 * An Observation.
 */
@Document(collection = "observation")
public class Observation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("datasetId")
    private String datasetId;

    @Field("dimensions")
    private Set<DimensionValue> dimensions = new HashSet<>();

    @Field("measures")
    private Map<String, Double> measures = new HashMap<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDatasetId() {
        return datasetId;
    }

    public void setDatasetId(String datasetId) {
        this.datasetId = datasetId;
    }

    public Set<DimensionValue> getDimensions() {
        return dimensions;
    }

    public void setDimensions(Set<DimensionValue> dimensions) {
        this.dimensions = dimensions;
    }

    public Map<String, Double> getMeasures() {
        return measures;
    }

    public void setMeasures(Map<String, Double> measures) {
        this.measures = measures;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Observation that = (Observation) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Observation{" +
            "id='" + id + '\'' +
            ", datasetId='" + datasetId + '\'' +
            ", dimensions=" + dimensions +
            ", measures=" + measures +
            '}';
    }
}
