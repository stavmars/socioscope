package gr.ekke.socioscope.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import javax.validation.constraints.*;

import java.io.IOException;
import java.io.Serializable;
import java.util.Map;
import java.util.Objects;

/**
 * A Measure.
 */
@Document(collection = "measure")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "measure")
public class Measure implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Size(min = 1)
    @Field("name")
    private Map<String, @NotBlank String> name;

    @NotNull
    @Size(min = 2)
    @Field("unit")
    private String unit;

    @DBRef
    @Field("creator")
    @JsonIgnoreProperties("")
    private User creator;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Measure() {
    }

    public Measure(String id, @Size(min = 1) Map<String, @NotBlank String> name, @NotNull @Size(min = 2) String unit, User creator) {
        this.id = id;
        this.name = name;
        this.unit = unit;
        this.creator = creator;
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

    public Measure name(Map<String, String> name) {
        this.name = name;
        return this;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public String getUnit() {
        return unit;
    }

    public Measure unit(String unit) {
        this.unit = unit;
        return this;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public User getCreator() {
        return creator;
    }

    public Measure creator(User user) {
        this.creator = user;
        return this;
    }

    public void setCreator(User user) {
        this.creator = user;
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

    @Override
    public String toString() {
        return "Measure{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", unit='" + getUnit() + "'" +
            "}";
    }
}
