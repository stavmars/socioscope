package gr.ekke.socioscope.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DataSet.
 */
@Document(collection = "data_set")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "dataset")
public class DataSet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Size(min = 3)
    @Field("name")
    private String name;

    @NotNull
    @Size(min = 2)
    @Field("type")
    private String type;

    @Field("comment")
    private String comment;

    @Field("dimensions")
//    @JsonIgnore
    private Set<Dimension> dimensions = new HashSet<>();

    @Field("measures")
//    @JsonIgnore
    private Set<Measure> measures = new HashSet<>();

    @DBRef
    @Field("creator")
    @JsonIgnoreProperties("")
    private User creator;

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

    public DataSet name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public DataSet type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getComment() {
        return comment;
    }

    public DataSet comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Set<Dimension> getDimensions() {
        return dimensions;
    }

    public DataSet dimensions(Set<Dimension> dimensions) {
        this.dimensions = dimensions;
        return this;
    }

    public DataSet addDimensions(Dimension dimension) {
        this.dimensions.add(dimension);
        dimension.setDataset(this);
        return this;
    }

    public DataSet removeDimensions(Dimension dimension) {
        this.dimensions.remove(dimension);
        dimension.setDataset(null);
        return this;
    }

    public void setDimensions(Set<Dimension> dimensions) {
        this.dimensions = dimensions;
    }

    public Set<Measure> getMeasures() {
        return measures;
    }

    public DataSet measures(Set<Measure> measures) {
        this.measures = measures;
        return this;
    }

    public DataSet addMeasures(Measure measure) {
        this.measures.add(measure);
        measure.setDataset(this);
        return this;
    }

    public DataSet removeMeasures(Measure measure) {
        this.measures.remove(measure);
        measure.setDataset(null);
        return this;
    }

    public void setMeasures(Set<Measure> measures) {
        this.measures = measures;
    }

    public User getCreator() {
        return creator;
    }

    public DataSet creator(User user) {
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
        DataSet dataSet = (DataSet) o;
        if (dataSet.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), dataSet.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DataSet{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
