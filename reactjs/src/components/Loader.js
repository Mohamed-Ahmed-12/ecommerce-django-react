import React from "react"
import ContentLoader from "react-content-loader"

export const ProductListSkeleton = props => (
    <ContentLoader viewBox="0 0 1360 900" height={900} width={1360} {...props}>
        <rect x="30" y="0" rx="2" ry="2" width="95.5%" height="20" />

        <rect x="30" y="30" rx="8" ry="8" width="200" height="200" />
        <rect x="30" y="250" rx="0" ry="0" width="200" height="18" />
        <rect x="30" y="275" rx="0" ry="0" width="120" height="20" />
        <rect x="250" y="30" rx="8" ry="8" width="200" height="200" />
        <rect x="250" y="250" rx="0" ry="0" width="200" height="18" />
        <rect x="250" y="275" rx="0" ry="0" width="120" height="20" />
        <rect x="470" y="30" rx="8" ry="8" width="200" height="200" />
        <rect x="470" y="250" rx="0" ry="0" width="200" height="18" />
        <rect x="470" y="275" rx="0" ry="0" width="120" height="20" />
        <rect x="690" y="30" rx="8" ry="8" width="200" height="200" />
        <rect x="690" y="250" rx="0" ry="0" width="200" height="18" />
        <rect x="690" y="275" rx="0" ry="0" width="120" height="20" />
        <rect x="910" y="30" rx="8" ry="8" width="200" height="200" />
        <rect x="910" y="250" rx="0" ry="0" width="200" height="18" />
        <rect x="910" y="275" rx="0" ry="0" width="120" height="20" />
        <rect x="1130" y="30" rx="8" ry="8" width="200" height="200" />
        <rect x="1130" y="250" rx="0" ry="0" width="200" height="18" />
        <rect x="1130" y="275" rx="0" ry="0" width="120" height="20" />
        <rect x="30" y="340" rx="8" ry="8" width="200" height="200" />
        <rect x="30" y="570" rx="0" ry="0" width="200" height="18" />
        <rect x="30" y="595" rx="0" ry="0" width="120" height="20" />
        <rect x="250" y="340" rx="8" ry="8" width="200" height="200" />
        <rect x="250" y="570" rx="0" ry="0" width="200" height="18" />
        <rect x="250" y="595" rx="0" ry="0" width="120" height="20" />
        <rect x="470" y="340" rx="8" ry="8" width="200" height="200" />
        <rect x="470" y="570" rx="0" ry="0" width="200" height="18" />
        <rect x="470" y="595" rx="0" ry="0" width="120" height="20" />
        <rect x="690" y="340" rx="8" ry="8" width="200" height="200" />
        <rect x="690" y="570" rx="0" ry="0" width="200" height="18" />
        <rect x="690" y="595" rx="0" ry="0" width="120" height="20" />
        <rect x="910" y="340" rx="8" ry="8" width="200" height="200" />
        <rect x="910" y="570" rx="0" ry="0" width="200" height="18" />
        <rect x="910" y="595" rx="0" ry="0" width="120" height="20" />
        <rect x="1130" y="340" rx="8" ry="8" width="200" height="200" />
        <rect x="1130" y="570" rx="0" ry="0" width="200" height="18" />
        <rect x="1130" y="595" rx="0" ry="0" width="120" height="20" />
    </ContentLoader>
)

export const ProductDetailsSkeleton = props => {
    return (
        <ContentLoader viewBox="0 0 900 300" height={"100%"} width={"100%"} {...props} backgroundColor="#f3f3f3" foregroundColor="#ecebeb" >
            <rect x="64" y="18" rx="0" ry="0" width="346" height="220" /> {/* Main Image */}
            <rect x="229" y="300" rx="0" ry="0" width="0" height="0" />
            <rect x="111" y="340" rx="0" ry="0" width="0" height="0" />
            <rect x="121" y="342" rx="0" ry="0" width="0" height="0" />
            <rect x="10" y="20" rx="0" ry="0" width="40" height="44" />
            <rect x="10" y="80" rx="0" ry="0" width="40" height="44" />
            <rect x="10" y="140" rx="0" ry="0" width="40" height="44" />
            <rect x="194" y="329" rx="0" ry="0" width="0" height="0" />
            <rect x="192" y="323" rx="0" ry="0" width="0" height="0" />
            <rect x="185" y="323" rx="0" ry="0" width="0" height="0" />

            <rect x="470" y="18" rx="0" ry="0" width="300" height="25" />
            <rect x="470" y="58" rx="0" ry="0" width="300" height="6" />
            <rect x="470" y="68" rx="0" ry="0" width="300" height="6" />
            <rect x="470" y="78" rx="0" ry="0" width="300" height="6" />
            <rect x="798" y="135" rx="0" ry="0" width="0" height="0" />
            <rect x="731" y="132" rx="0" ry="0" width="0" height="0" />
            <rect x="470" y="99" rx="0" ry="0" width="70" height="30" />
            <rect x="560" y="99" rx="0" ry="0" width="70" height="30" />
        </ContentLoader>
    )
}


export const ReviewProductSkelton = props => {
    return (
        <ContentLoader viewBox="0 0 900 300" height={"100%"} width={"100%"} {...props} backgroundColor="#f3f3f3" foregroundColor="#ecebeb" >
<circle cx="30" cy="55" r="25" />
<rect x="70" y="40" rx="0" ry="0" width="75" height="10" />
<rect x="70" y="60" rx="0" ry="0" width="75" height="10" />
<rect x="8" y="85" rx="0" ry="0" width="50%" height="10" />
<rect x="8" y="105" rx="0" ry="0" width="50%" height="10" />
<rect x="8" y="125" rx="0" ry="0" width="50%" height="10" />

<circle cx="30" cy="165" r="25" />
<rect x="70" y="150" rx="0" ry="0" width="75" height="10" />
<rect x="70" y="170" rx="0" ry="0" width="75" height="10" />
<rect x="8" y="195" rx="0" ry="0" width="50%" height="10" />
<rect x="8" y="215" rx="0" ry="0" width="50%" height="10" />
<rect x="8" y="235" rx="0" ry="0" width="50%" height="10" />


        </ContentLoader>
    );
}
