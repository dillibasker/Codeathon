const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  medications: [{ name: String, time: String }],
  vitals: { heartRate: Number, bloodPressure: String },
  caregiver: String,
});

const User = mongoose.model("User", UserSchema);