package gr.ekke.socioscope.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import javax.validation.constraints.*;

import java.io.Serializable;
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

    @NotNull
    @Size(min = 3)
    @Field("name")
    private String name;

    @NotNull
    @Size(min = 2)
    @Field("unit")
    private String unit;

    @DBRef
    @Field("creator")
    @JsonIgnoreProperties("")
    private User creator;

    @DBRef
    @Field("dataset")
    @JsonIgnoreProperties("measures")
    private DataSet dataset;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Measure name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
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

    public DataSet getDataset() {
        return dataset;
    }

    public Measure dataset(DataSet dataSet) {
        this.dataset = dataSet;
        return this;
    }

    public void setDataset(DataSet dataSet) {
        this.dataset = dataSet;
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
