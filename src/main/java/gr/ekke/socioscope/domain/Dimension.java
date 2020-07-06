package gr.ekke.socioscope.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.paramnames.ParameterNamesModule;
import org.bson.json.JsonParseException;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.IOException;
import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * A Dimension.
 */
@Document(collection = "dimension")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "dimension")
public class Dimension implements Serializable {

    private static final long serialVersionUID = 1L;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    List<DimensionLevel> levels;
    @Id
    private String id;
    @Size(min = 1)
    @Field("name")
    private Map<String, @NotBlank String> name;

    @Field("description")
    private Map<String, @NotBlank String> description;

    private Map<String, @NotBlank String> details;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String groupId;

    private String order;

    @NotNull
    @Field("type")
    private String type;
    @Field("dependencies")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<String> dependencies;
    @DBRef
    @Field("creator")
    @JsonIgnoreProperties("")
    private User creator;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<String> composedOf;

    private Boolean disableAxis;

    private Boolean disableFilter;

    private String filterWidget;

    private Boolean disableStacking;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Dimension() {
    }


    @JsonCreator
    public static Dimension create(String jsonString) throws JsonParseException, IOException {
        ObjectMapper mapper = new ObjectMapper()
            .registerModule(new ParameterNamesModule())
            .registerModule(new Jdk8Module())
            .registerModule(new JavaTimeModule());
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        Dimension dimension = mapper.readValue(jsonString, Dimension.class);
        return dimension;
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

    public Dimension name(Map<String, String> name) {
        this.name = name;
        return this;
    }

    public Map<String, String> getDescription() {
        return description;
    }

    public void setDescription(Map<String, String> description) {
        this.description = description;
    }

    public Dimension description(Map<String, String> description) {
        this.description = description;
        return this;
    }

    public Map<String, String> getDetails() {
        return details;
    }

    public void setDetails(Map<String, String> details) {
        this.details = details;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Dimension type(String type) {
        this.type = type;
        return this;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User user) {
        this.creator = user;
    }

    public Dimension creator(User user) {
        this.creator = user;
        return this;
    }

    public List<String> getDependencies() {
        return dependencies;
    }

    public void setDependencies(List<String> dependencies) {
        this.dependencies = dependencies;
    }

    public Dimension dependencies(List<String> dependencies) {
        this.dependencies = dependencies;
        return this;
    }

    public List<DimensionLevel> getLevels() {
        return levels;
    }

    public void setLevels(List<DimensionLevel> levels) {
        this.levels = levels;
    }

    public List<String> getComposedOf() {
        return composedOf;
    }

    public void setComposedOf(List<String> composedOf) {
        this.composedOf = composedOf;
    }

    public Boolean getDisableAxis() {
        return disableAxis;
    }

    public void setDisableAxis(Boolean disableAxis) {
        this.disableAxis = disableAxis;
    }

    public Boolean getDisableFilter() {
        return disableFilter;
    }

    public void setDisableFilter(Boolean disableFilter) {
        this.disableFilter = disableFilter;
    }

    public Boolean getDisableStacking() {
        return disableStacking;
    }

    public void setDisableStacking(Boolean disableStacking) {
        this.disableStacking = disableStacking;
    }

    public String getFilterWidget() {
        return filterWidget;
    }

    public void setFilterWidget(String filterWidget) {
        this.filterWidget = filterWidget;
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
            "levels=" + levels +
            ", id='" + id + '\'' +
            ", name=" + name +
            ", description=" + description +
            ", details=" + details +
            ", groupId='" + groupId + '\'' +
            ", order='" + order + '\'' +
            ", type='" + type + '\'' +
            ", dependencies=" + dependencies +
            ", creator=" + creator +
            ", composedOf=" + composedOf +
            ", disableAxis=" + disableAxis +
            ", disableFilter=" + disableFilter +
            ", filterWidget='" + filterWidget + '\'' +
            ", disableStacking=" + disableStacking +
            '}';
    }
}
