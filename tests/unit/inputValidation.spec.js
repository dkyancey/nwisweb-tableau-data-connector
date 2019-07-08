import { shallowMount, createLocalVue } from "@vue/test-utils";
import Main from "@/components/Main";
import { locationMode } from "../../src/enums.js";
import {
  validateStateInputs,
  validateCoordinateInputs,
  validateSiteInputs,
  validateHydroCodeInputs
} from "../../src/inputValidation.js";
import Vuex from "vuex";
const localVue = createLocalVue();
localVue.use(Vuex);

describe("Main", () => {
  let store;

  test("validateStateInputs rejects an invalid state query", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.STATE;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let state = "not a state";
    expect(validateStateInputs(state, wrapper.vm)).not.toBe(true);
  });

  test("validateStateInputs accepts a valid state query", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.STATE;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let state = "Montana";
    wrapper.vm.stateData = { Montana: "MT" };
    expect(validateStateInputs(state, wrapper.vm)).toBe(true);
  });

  test("validateStateInputs ingores an invalid state query when locationmode is not STATE", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.COORDS;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let state = "not a state";
    expect(validateStateInputs(state, wrapper.vm)).toBe(true);
  });

  test("validateCoordinateInputs successfully rejects non-numeric parameters", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.COORDS;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let coordinates = {
      north: "these",
      south: "1",
      west: "1",
      east: "2"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "are",
      west: "1",
      east: "2"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "not",
      east: "1"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "1",
      east: "coordinates"
    };
    coordinates = {
      north: "",
      south: "1",
      west: "1",
      east: "2"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "",
      west: "1",
      east: "2"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "",
      east: "1"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "1",
      east: ""
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
  });
  test("validateCoordinateInputs successfully rejects out of bounds numbers", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.COORDS;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let coordinates = {
      north: "100",
      south: "1",
      west: "1",
      east: "2"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "-100",
      west: "1",
      east: "2"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "1",
      west: "-200",
      east: "1"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "1",
      west: "1",
      east: "200"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
  });
  test("validateCoordinateInputs successfully rejects invalid boundaries", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.COORDS;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let coordinates = {
      north: "-1",
      south: "1",
      west: "1",
      east: "2"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "1",
      east: "-1"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
  });
  test("validateCoordinateInputs successfully accepts valid boundaries", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.COORDS;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let coordinates = {
      north: "1",
      south: "-1",
      west: "-1",
      east: "1"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).toBe(true);
    coordinates = {
      north: "2.000000",
      south: "1.000000",
      west: "1.000000",
      east: "2.000000"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).toBe(true);
  });
  test("validateSiteInputs successfully accepts valid params", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.SITE;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let siteList = "11111111, 11111111  , 11112222";
    expect(validateSiteInputs(siteList, wrapper.vm)).toBe(true);
    siteList = "11111111  , 11112222";
    expect(validateSiteInputs(siteList, wrapper.vm)).toBe(true);
    siteList = "11112222";
    expect(validateSiteInputs(siteList, wrapper.vm)).toBe(true);
  });
  test("validateSiteInputs successfully rejects invalid params", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.SITE;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });

    let siteList = "";
    expect(validateSiteInputs(siteList, wrapper.vm)).not.toBe(true);
    siteList = "11112,,,,,222";
    expect(validateSiteInputs(siteList, wrapper.vm)).not.toBe(true);
    siteList = ",11111111 , 11111111";
    expect(validateSiteInputs(siteList, wrapper.vm)).not.toBe(true);
    siteList = "11111111 ,11111111,1111111,";
    expect(validateSiteInputs(siteList, wrapper.vm)).not.toBe(true);
    siteList = "";
    expect(validateSiteInputs(siteList, wrapper.vm)).not.toBe(true);
  });

  test("validateHydroCodeInputs successfully accepts valid params", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.HYDRO;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let hydroCode = "11";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).toBe(true);
    hydroCode = "11,11111111,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).toBe(true);
    hydroCode = "11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).toBe(true);
    hydroCode =
      "11,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).toBe(true);
    hydroCode =
      "11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).toBe(true);
  });

  test("validateHydroCodeInputs successfully rejects invalid params", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.HYDRO;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let hydroCode = "1";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode = "11,1111111,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode = "1111111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode =
      "11,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode =
      "11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode =
      "11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,111111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode = "11,1111111a,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode = "1f";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode = "1111111f";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode = "1111111.";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
  });
});
