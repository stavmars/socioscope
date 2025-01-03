package gr.ekke.socioscope.domain;

import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Dimension Value.
 */
public class DimensionValue implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank
    @Field("id")
    private String id;

    @NotBlank
    @Field("value")
    private String value;

    public DimensionValue() {
    }

    public DimensionValue(@NotBlank String id, @NotBlank String value) {
        this.id = id;
        this.value = value;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DimensionValue that = (DimensionValue) o;
        return Objects.equals(id, that.id) &&
            Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, value);
    }

    @Override
    public String toString() {
        return "DimensionValue{" +
            "id='" + id + '\'' +
            ", value='" + value + '\'' +
            '}';
    }
}
