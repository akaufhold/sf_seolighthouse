<?php
declare(strict_types=1);

namespace Stackfactory\SfSeolighthouse\Domain\Model;


/**
 *
 * This file is part of the "SEO Lighthouse Score" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2021 Andreas Kauhold <info@stackfactory.de>, Stackfactory
 */

/**
 * LighthouseStatistics
 */
class LighthouseStatistics extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
{

    /**
     * First Contentful Paint
     * 
     * @var float
     */
    protected $fcp = 0.0;

    /**
     * Speed Index
     * 
     * @var float
     */
    protected $si = 0.0;

    /**
     * Largest Contentful Paint
     * 
     * @var string
     */
    protected $lcp = '';

    /**
     * Time to Interactive
     * 
     * @var string
     */
    protected $tti = '';

    /**
     * Total Blocking Time
     * 
     * @var string
     */
    protected $tbt = '';

    /**
     * Cumulative Layout Shift
     * 
     * @var string
     */
    protected $cls = '';

    /**
     * Returns the fcp
     * 
     * @return float $fcp
     */
    public function getFcp()
    {
        return $this->fcp;
    }

    /**
     * Sets the fcp
     * 
     * @param float $fcp
     * @return void
     */
    public function setFcp($fcp)
    {
        $this->fcp = $fcp;
    }

    /**
     * Returns the si
     * 
     * @return float $si
     */
    public function getSi()
    {
        return $this->si;
    }

    /**
     * Sets the si
     * 
     * @param float $si
     * @return void
     */
    public function setSi($si)
    {
        $this->si = $si;
    }

    /**
     * Returns the lcp
     * 
     * @return string $lcp
     */
    public function getLcp()
    {
        return $this->lcp;
    }

    /**
     * Sets the lcp
     * 
     * @param string $lcp
     * @return void
     */
    public function setLcp($lcp)
    {
        $this->lcp = $lcp;
    }

    /**
     * Returns the tti
     * 
     * @return string $tti
     */
    public function getTti()
    {
        return $this->tti;
    }

    /**
     * Sets the tti
     * 
     * @param string $tti
     * @return void
     */
    public function setTti($tti)
    {
        $this->tti = $tti;
    }

    /**
     * Returns the tbt
     * 
     * @return string $tbt
     */
    public function getTbt()
    {
        return $this->tbt;
    }

    /**
     * Sets the tbt
     * 
     * @param string $tbt
     * @return void
     */
    public function setTbt($tbt)
    {
        $this->tbt = $tbt;
    }

    /**
     * Returns the cls
     * 
     * @return string $cls
     */
    public function getCls()
    {
        return $this->cls;
    }

    /**
     * Sets the cls
     * 
     * @param string $cls
     * @return void
     */
    public function setCls($cls)
    {
        $this->cls = $cls;
    }
}
