package gr.ekke.socioscope.domain;

import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Measure Value.
 */
public class MeasureValue implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Field("id")
    private String id;

    @Field("value")
    private Double value;


    public MeasureValue(@NotNull String id, Double value) {
        this.id = id;
        this.value = value;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MeasureValue that = (MeasureValue) o;
        return Objects.equals(id, that.id) &&
            Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, value);
    }

    @Override
    public String toString() {
        return "MeasureValue{" +
            "id='" + id + '\'' +
            ", value=" + value +
            '}';
    }
}
