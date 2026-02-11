import express from "express";
import { getAllOrgs, getAllReposOfOrg } from "../controller/org.controller.js";

const router = express.Router();

router.get("/", getAllOrgs);
router.get("/:org/repos", getAllReposOfOrg);

export default router;
