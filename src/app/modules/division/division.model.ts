import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    thambnail: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const tour_slug = this.name.toLowerCase().split(" ").join("-");

    let slug = tour_slug;

    let count = 0;

    while (await DivisionModel.exists({ slug })) {
      slug = `${slug}-${count++}`;
    }

    this.slug = tour_slug;
  }

  next();
});

//query middleware
divisionSchema.pre("findOneAndUpdate", async function (next) {
  const division = this.getUpdate() as Partial<IDivision>;

  if (division.name) {
  const baseSlug = division.name?.toLowerCase().split(" ").join("-");

    let slug = `${baseSlug}-division`;

    let count = 0;
    while (await DivisionModel.exists({ slug })) {
      slug = `${slug}-${count++}`;
    }
    division.slug = slug;
  }
  this.setUpdate(division);
  next();
});

export const DivisionModel = model<IDivision>("Division", divisionSchema);
