package gr.ekke.socioscope.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Map;
import java.util.Objects;

/**
 * A DimensionCode.
 */
@Document(collection = "dimension_code")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "dimensioncode")
public class DimensionCode implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("dimension_id")
    private String dimensionId;

    @NotNull
    @Field("notation")
    private String notation;

    @NotNull
    @Size(min = 1)
    @Field("name")
    private Map<String, @NotBlank String> name;

    @Field("description")
    private Map<String, String> description;

    @Field("parent_id")
    private String parentId;

    @Field("order")
    private Integer order;

    @Field("color")
    private String color;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDimensionId() {
        return dimensionId;
    }

    public DimensionCode dimensionId(String dimensionId) {
        this.dimensionId = dimensionId;
        return this;
    }

    public void setDimensionId(String dimensionId) {
        this.dimensionId = dimensionId;
    }

    public String getNotation() {
        return notation;
    }

    public DimensionCode notation(String notation) {
        this.notation = notation;
        return this;
    }

    public void setNotation(String notation) {
        this.notation = notation;
    }

    public Map<String, String> getName() {
        return name;
    }

    public DimensionCode name(Map<String, String> name) {
        this.name = name;
        return this;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public Map<String, String> getDescription() {
        return description;
    }

    public DimensionCode description(Map<String, String> description) {
        this.description = description;
        return this;
    }

    public void setDescription(Map<String, String> description) {
        this.description = description;
    }

    public String getParentId() {
        return parentId;
    }

    public DimensionCode parentId(String parentId) {
        this.parentId = parentId;
        return this;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public Integer getOrder() {
        return order;
    }

    public DimensionCode order(Integer order) {
        this.order = order;
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public String getColor() {
        return color;
    }

    public DimensionCode color(String color) {
        this.color = color;
        return this;
    }

    public void setColor(String color) {
        this.color = color;
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
        DimensionCode dimensionCode = (DimensionCode) o;
        if (dimensionCode.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), dimensionCode.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DimensionCode{" +
            "id=" + getId() +
            ", dimensionId='" + getDimensionId() + "'" +
            ", notation='" + getNotation() + "'" +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", parentId='" + getParentId() + "'" +
            ", order=" + getOrder() +
            ", color='" + getColor() + "'" +
            "}";
    }
}
