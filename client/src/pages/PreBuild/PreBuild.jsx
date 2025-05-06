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
        response.data.prebuilds.filter((item) => item.isFeatured === true)
      );
      setGamingData(
        response.data.prebuilds.filter(
          (item) => item.category.name === "Gaming"
        )
      );
      setPorductivityData(
        response.data.prebuilds.filter(
          (item) => item.category.name === "Productivity"
        )
      );
    }
  };

  useEffect(() => {
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
          builds={featureData}
        />
        <EachSection
          showH2={false}
          h3="Gaming builds"
          p="Get the perfect blend of performance and value with this build, tailored for gamers who want high-quality gameplay without breaking the bank."
          className="section"
          builds={gamingData}
        />
        <EachSection
          showH2={false}
          h3="Productivity builds"
          p="Get the perfect blend of performance and value with this build, tailored for gamers who want high-quality gameplay without breaking the bank."
          className="section"
          builds={porductivityData} 
        />
      </Container>
    </main>
  );
}

export default PreBuild;
