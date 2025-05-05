import EachSection from "./EachSection";
import { Container } from "../../components";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";

function PreBuild() {
  const { useEffect, useState, apis } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const [featureData, setFeatureData] = useState([]);
  const [gamingData, setGamingData] = useState([]);
  const [porductivityData, setPorductivityData] = useState([]);

  useEffect(() => {
    const showAllBuilds = async () => {
      const response = await apiSubmit({
        url: apis().getPrebuildDropdown.url,
        method: apis().getPrebuildDropdown.method,
        successMessage: null,
        showLoadingToast: true,
        loadingMessage: "Fetching...",
      });
      if (response?.success) {
        setFeatureData(
          response?.data?.prebuilds.filter(
            (build) => build.category.name === "Featured"
          )
        );

        setGamingData(
          response?.data?.prebuilds.filter(
            (build) => build.category.name === "Gaming"
          )
        );

        setPorductivityData(
          response?.data?.prebuilds.filter(
            (build) => build.category.name === "Productivity"
          )
        );
      }
    };

    showAllBuilds();
  }, []);

  return (
    <main>
      <Container className={""}>
        {/* Pass featureData as a prop to EachSection */}
        <EachSection
          h2normal="Pre-Built"
          h2span="Page"
          h3="Featured builds"
          p="Get the perfect blend of performance and value with this build, tailored for gamers who want high-quality gameplay without breaking the bank."
          showH2={true}
          builds={featureData?.filter((build) =>
            build.subcategories.includes("Featured")
          )} // Filter data by category
        />
        <EachSection
          showH2={false}
          h3="Gaming builds"
          p="Get the perfect blend of performance and value with this build, tailored for gamers who want high-quality gameplay without breaking the bank."
          className="section"
          builds={gamingData?.filter((build) =>
            build.subcategories.includes("Gaming")
          )} // Filter data by category
        />
        <EachSection
          showH2={false}
          h3="Productivity builds"
          p="Get the perfect blend of performance and value with this build, tailored for gamers who want high-quality gameplay without breaking the bank."
          className="section"
          builds={porductivityData?.filter((build) =>
            build.subcategories.includes("Productivity")
          )} // Filter data by category
        />
      </Container>
    </main>
  );
}

export default PreBuild;
