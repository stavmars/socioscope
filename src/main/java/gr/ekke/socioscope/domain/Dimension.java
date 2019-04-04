package gr.ekke.socioscope.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Dimension.
 */
@Document(collection = "dimension")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "dimension")
public class Dimension implements Serializable {

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

    @DBRef
    @Field("creator")
    @JsonIgnoreProperties("")
    private User creator;

    @DBRef
    @Field("dataset")
    @JsonIgnoreProperties("dimensions")
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

    public Dimension name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public Dimension type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public User getCreator() {
        return creator;
    }

    public Dimension creator(User user) {
        this.creator = user;
        return this;
    }

    public void setCreator(User user) {
        this.creator = user;
    }

    public DataSet getDataset() {
        return dataset;
    }

    public Dimension dataset(DataSet dataSet) {
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
        Dimension dimension = (Dimension) o;
        if (dimension.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), dimension.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Dimension{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
