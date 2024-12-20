package gr.ekke.socioscope.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.IOException;
import java.io.Serializable;
import java.util.Map;
import java.util.Objects;

/**
 * A Measure.
 */
@Document(collection = "measure")
public class Measure implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Size(min = 1)
    @Field("name")
    private Map<String, @NotBlank String> name;

    @Field("unit")
    private String unit;

    @Field("type")
    private String type;

    @Field("decimalPlaces")
    private Integer decimalPlaces;

    @Field("thresholdMin")
    private Integer thresholdMin;

    @Field("thresholdMax")
    private Integer thresholdMax;

    @Field("thresholdStep")
    private Integer thresholdStep;

    @Field("thresholdDependency")
    private String thresholdDependency;

    @Field("allowThreshold")
    private Boolean allowThreshold;

    @Field("thresholdAccumulator")
    private String thresholdAccumulator;

    @DBRef
    @Field("creator")
    @JsonIgnoreProperties("")
    private User creator;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Measure() {
    }

    @JsonCreator
    public static Measure create(String jsonString) throws JsonParseException, JsonMappingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        Measure measure = null;
        measure = mapper.readValue(jsonString, Measure.class);
        return measure;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getName() {
        return name;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public Measure name(Map<String, String> name) {
        this.name = name;
        return this;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Measure unit(String unit) {
        this.unit = unit;
        return this;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User user) {
        this.creator = user;
    }

    public Measure creator(User user) {
        this.creator = user;
        return this;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Measure type(String type) {
        this.type = type;
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Measure measure = (Measure) o;
        if (measure.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), measure.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    public Integer getDecimalPlaces() {
        return decimalPlaces;
    }

    public void setDecimalPlaces(Integer decimalPlaces) {
        this.decimalPlaces = decimalPlaces;
    }

    public Integer getThresholdMin() {
        return thresholdMin;
    }

    public void setThresholdMin(Integer thresholdMin) {
        this.thresholdMin = thresholdMin;
    }

    public Integer getThresholdMax() {
        return thresholdMax;
    }

    public void setThresholdMax(Integer thresholdMax) {
        this.thresholdMax = thresholdMax;
    }

    public Integer getThresholdStep() {
        return thresholdStep;
    }

    public void setThresholdStep(Integer thresholdStep) {
        this.thresholdStep = thresholdStep;
    }

    public String getThresholdDependency() {
        return thresholdDependency;
    }

    public void setThresholdDependency(String thresholdDependency) {
        this.thresholdDependency = thresholdDependency;
    }
    public Boolean getAllowThreshold() {
        return allowThreshold;
    }

    public void setAllowThreshold(Boolean allowThreshold) {
        this.allowThreshold = allowThreshold;
    }

    public String getThresholdAccumulator() {
        return thresholdAccumulator;
    }

    public void setThresholdAccumulator(String thresholdAccumulator) {
        this.thresholdAccumulator = thresholdAccumulator;
    }

}
