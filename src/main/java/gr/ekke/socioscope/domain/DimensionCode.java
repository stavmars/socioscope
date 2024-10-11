package gr.ekke.socioscope.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * A DimensionCode.
 */
@Document(collection = "dimension_code")
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

    private Map<String, @NotBlank String> shortName;

    @Field("description")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Map<String, String> description;

    @Field("parent_id")
    private String parentId;

    @Field("order")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer order;

    @Field("color")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String color;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String iconURL;

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

    public void setDimensionId(String dimensionId) {
        this.dimensionId = dimensionId;
    }

    public DimensionCode dimensionId(String dimensionId) {
        this.dimensionId = dimensionId;
        return this;
    }

    public String getNotation() {
        return notation;
    }

    public void setNotation(String notation) {
        this.notation = notation;
    }

    public DimensionCode notation(String notation) {
        this.notation = notation;
        return this;
    }

    public Map<String, String> getName() {
        return name;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public DimensionCode name(Map<String, String> name) {
        this.name = name;
        return this;
    }

    public Map<String, String> getShortName() {
        return shortName;
    }

    public void setShortName(Map<String, String> shortName) {
        this.shortName = shortName;
    }

    public Map<String, String> getDescription() {
        return description;
    }

    public void setDescription(Map<String, String> description) {
        this.description = description;
    }

    public DimensionCode description(Map<String, String> description) {
        this.description = description;
        return this;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public DimensionCode parentId(String parentId) {
        this.parentId = parentId;
        return this;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public DimensionCode order(Integer order) {
        this.order = order;
        return this;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public DimensionCode color(String color) {
        this.color = color;
        return this;
    }

    public String getIconURL() {
        return iconURL;
    }

    public void setIconURL(String iconURL) {
        this.iconURL = iconURL;
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
            "id='" + id + '\'' +
            ", dimensionId='" + dimensionId + '\'' +
            ", notation='" + notation + '\'' +
            ", name=" + name +
            ", shortName=" + shortName +
            ", description=" + description +
            ", parentId='" + parentId + '\'' +
            ", order=" + order +
            ", color='" + color + '\'' +
            ", iconURL='" + iconURL + '\'' +
            '}';
    }
}
