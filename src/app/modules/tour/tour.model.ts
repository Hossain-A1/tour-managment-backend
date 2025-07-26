import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { versionKey: false }
);

export const TourTypeModel = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      required: true,
      unique:true
    },
    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
    },
     departureLocation: {
      type: String,
    },
    arrivalLocation: {
      type: String,
    },
    costFrom: {
      type: Number,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    included: {
      type: [String],
      default: [],
    },
    excluded: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    tourPlan: {
      type: [String],
      default: [],
    },
    maxGuest: {
      type: Number,
    },
    minAge: {
      type: Number,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);





tourSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    const tour_slug = this.title.toLowerCase().split(" ").join("-");

    let slug = tour_slug;

    let count = 0;

    while (await TourModel.exists({ slug })) {
      slug = `${slug}-${count++}`;
    }

    this.slug = tour_slug;
  }

  next();
});

//query middleware
tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as Partial<ITour>;

  if (tour.title) {
  const baseSlug = tour.title?.toLowerCase().split(" ").join("-");

    let slug = `${baseSlug}`;

    let count = 0;
    while (await TourModel.exists({ slug })) {
      slug = `${slug}-${count++}`;
    }
    tour.slug = slug;
  }
  this.setUpdate(tour);
  next();
});

export const TourModel = model<ITour>("Tour", tourSchema);
