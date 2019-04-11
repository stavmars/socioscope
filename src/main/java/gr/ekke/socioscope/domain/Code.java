package gr.ekke.socioscope.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Code.
 */
public class Code implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Field("id")
    private String id;

    @NotNull
    @Field("name")
    private String name;

    @Field("description")
    private String description;

    private String parentCodeId;

    @Field("order")
    private Integer order;

    @Field("color")
    private String color;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Code name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public Code description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getParentCodeId() {
        return parentCodeId;
    }

    public Code parentCodeId(String parentCodeId) {
        this.parentCodeId = parentCodeId;
        return this;
    }

    public void setParentCodeId(String parentCodeId) {
        this.parentCodeId = parentCodeId;
    }

    public Integer getOrder() {
        return order;
    }

    public Code order(Integer order) {
        this.order = order;
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public String getColor() {
        return color;
    }

    public Code color(String color) {
        this.color = color;
        return this;
    }

    public void setColor(String color) {
        this.color = color;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Code code = (Code) o;
        if (code.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), code.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Code{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", parentCodeId='" + getParentCodeId() + "'" +
            ", order=" + getOrder() +
            ", color='" + getColor() + "'" +
            "}";
    }
}
