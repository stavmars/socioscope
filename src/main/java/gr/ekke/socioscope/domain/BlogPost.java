package gr.ekke.socioscope.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A BlogPost.
 */
@Document(collection = "blog_post")
public class BlogPost implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("preview_title")
    private String previewTitle;

    @Field("preview_image")
    private byte[] previewImage;

    @Field("preview_image_content_type")
    private String previewImageContentType;

    @NotNull
    @Field("content")
    private String content;

    @Field("post_date")
    private Instant postDate;

    @Field("published")
    private Boolean published;

    @Field("preview_text")
    private String previewText;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPreviewTitle() {
        return previewTitle;
    }

    public BlogPost previewTitle(String previewTitle) {
        this.previewTitle = previewTitle;
        return this;
    }

    public void setPreviewTitle(String previewTitle) {
        this.previewTitle = previewTitle;
    }

    public byte[] getPreviewImage() {
        return previewImage;
    }

    public BlogPost previewImage(byte[] previewImage) {
        this.previewImage = previewImage;
        return this;
    }

    public void setPreviewImage(byte[] previewImage) {
        this.previewImage = previewImage;
    }

    public String getPreviewImageContentType() {
        return previewImageContentType;
    }

    public BlogPost previewImageContentType(String previewImageContentType) {
        this.previewImageContentType = previewImageContentType;
        return this;
    }

    public void setPreviewImageContentType(String previewImageContentType) {
        this.previewImageContentType = previewImageContentType;
    }

    public String getContent() {
        return content;
    }

    public BlogPost content(String content) {
        this.content = content;
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getPostDate() {
        return postDate;
    }

    public BlogPost postDate(Instant postDate) {
        this.postDate = postDate;
        return this;
    }

    public void setPostDate(Instant postDate) {
        this.postDate = postDate;
    }

    public Boolean isPublished() {
        return published;
    }

    public BlogPost published(Boolean published) {
        this.published = published;
        return this;
    }

    public void setPublished(Boolean published) {
        this.published = published;
    }

    public String getPreviewText() {
        return previewText;
    }

    public BlogPost previewText(String previewText) {
        this.previewText = previewText;
        return this;
    }

    public void setPreviewText(String previewText) {
        this.previewText = previewText;
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
        BlogPost blogPost = (BlogPost) o;
        if (blogPost.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), blogPost.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "BlogPost{" +
            "id=" + getId() +
            ", previewTitle='" + getPreviewTitle() + "'" +
            ", previewImage='" + getPreviewImage() + "'" +
            ", previewImageContentType='" + getPreviewImageContentType() + "'" +
            ", content='" + getContent() + "'" +
            ", postDate='" + getPostDate() + "'" +
            ", published='" + isPublished() + "'" +
            ", previewText='" + getPreviewText() + "'" +
            "}";
    }
}
